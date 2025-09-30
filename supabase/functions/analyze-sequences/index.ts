import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { projectId, sequences } = await req.json();
    console.log('Analyzing sequences for project:', projectId);

    // Update project status to processing
    await supabaseClient
      .from('projects')
      .update({ status: 'processing' })
      .eq('id', projectId);

    // Call Lovable AI for sequence analysis
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const analysisPrompt = `Analyze the following DNA sequences and provide taxonomic classification.
    
Sequences to analyze:
${sequences.map((seq: any, idx: number) => `
Sequence ${idx + 1}:
${seq.sequence_data.substring(0, 200)}... (length: ${seq.length})
`).join('\n')}

Please provide:
1. Taxonomic classification (Kingdom, Phylum, Class, Order, Family, Genus, Species)
2. Confidence scores for each classification
3. Identify any potentially novel species
4. Quality assessment of sequences

Respond in JSON format with this structure:
{
  "taxa": [
    {
      "kingdom": "string",
      "phylum": "string",
      "class": "string",
      "order": "string",
      "family": "string",
      "genus": "string",
      "species": "string",
      "confidence": number,
      "is_novel": boolean,
      "sequence_count": number
    }
  ],
  "summary": {
    "total_taxa": number,
    "novel_species": number,
    "average_confidence": number
  }
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert bioinformatician specializing in eDNA sequence analysis and taxonomic classification. Provide accurate, scientifically rigorous classifications.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI analysis failed: ${aiResponse.statusText}`);
    }

    const aiData = await aiResponse.json();
    const analysisResult = JSON.parse(aiData.choices[0].message.content);

    // Save analysis results
    const { data: analysisRecord, error: analysisError } = await supabaseClient
      .from('analysis_results')
      .insert({
        project_id: projectId,
        user_id: user.id,
        taxa_count: analysisResult.summary.total_taxa,
        novel_species_count: analysisResult.summary.novel_species,
        sequences_processed: sequences.length,
        accuracy_rate: analysisResult.summary.average_confidence,
        summary: analysisResult.summary
      })
      .select()
      .single();

    if (analysisError) throw analysisError;

    // Save individual taxa
    const taxaInserts = analysisResult.taxa.map((taxon: any) => ({
      analysis_id: analysisRecord.id,
      kingdom: taxon.kingdom,
      phylum: taxon.phylum,
      class: taxon.class,
      order_name: taxon.order,
      family: taxon.family,
      genus: taxon.genus,
      species: taxon.species,
      confidence_score: taxon.confidence,
      sequence_count: taxon.sequence_count || 1,
      is_novel: taxon.is_novel || false
    }));

    await supabaseClient
      .from('taxa_identified')
      .insert(taxaInserts);

    // Update project status to completed
    await supabaseClient
      .from('projects')
      .update({ status: 'completed' })
      .eq('id', projectId);

    console.log('Analysis completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisRecord,
        taxa_count: analysisResult.summary.total_taxa
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in analyze-sequences:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
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

    const { fileId, content, projectId } = await req.json();
    console.log('Processing file:', fileId);

    // Parse FASTA/FASTQ format
    const sequences = parseSequenceFile(content);
    console.log(`Parsed ${sequences.length} sequences`);

    // Validate sequences
    const validatedSequences = sequences.map(seq => ({
      ...seq,
      quality_score: calculateQualityScore(seq.sequence),
      length: seq.sequence.length
    }));

    // Save sequences to database
    const sequenceInserts = validatedSequences.map(seq => ({
      file_id: fileId,
      sequence_data: seq.sequence,
      quality_score: seq.quality_score,
      length: seq.length,
      metadata: {
        header: seq.header,
        description: seq.description
      }
    }));

    const { data: savedSequences, error } = await supabaseClient
      .from('sequences')
      .insert(sequenceInserts)
      .select();

    if (error) throw error;

    console.log(`Successfully saved ${savedSequences.length} sequences`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sequences_count: savedSequences.length,
        sequences: savedSequences
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in process-file-upload:', error);
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

// Parse FASTA or FASTQ format
function parseSequenceFile(content: string): Array<{ header: string; sequence: string; description?: string }> {
  const sequences = [];
  
  if (content.startsWith('>')) {
    // FASTA format
    const entries = content.split('>').filter(e => e.trim());
    for (const entry of entries) {
      const lines = entry.split('\n');
      const header = lines[0].trim();
      const sequence = lines.slice(1).join('').replace(/\s/g, '');
      sequences.push({ header, sequence });
    }
  } else if (content.startsWith('@')) {
    // FASTQ format
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i += 4) {
      if (lines[i] && lines[i + 1]) {
        const header = lines[i].substring(1).trim();
        const sequence = lines[i + 1].trim();
        sequences.push({ header, sequence });
      }
    }
  } else {
    // Plain text - assume each line is a sequence
    const lines = content.split('\n').filter(l => l.trim());
    lines.forEach((line, idx) => {
      sequences.push({ 
        header: `Sequence_${idx + 1}`, 
        sequence: line.trim() 
      });
    });
  }
  
  return sequences;
}

// Calculate basic quality score
function calculateQualityScore(sequence: string): number {
  if (!sequence || sequence.length === 0) return 0;
  
  const validBases = sequence.split('').filter(base => 
    ['A', 'T', 'C', 'G', 'U', 'N'].includes(base.toUpperCase())
  ).length;
  
  const gcContent = sequence.split('').filter(base => 
    ['G', 'C'].includes(base.toUpperCase())
  ).length / sequence.length;
  
  // Score based on valid bases and GC content
  const validityScore = (validBases / sequence.length) * 50;
  const gcScore = (gcContent >= 0.4 && gcContent <= 0.6) ? 50 : 30;
  
  return Math.min(100, validityScore + gcScore);
}
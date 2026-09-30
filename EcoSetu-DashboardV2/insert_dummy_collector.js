import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://snalrtryhwfyyhlujmxr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuYWxydHJ5aHdmeXlobHVqbXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0NDMxMTMsImV4cCI6MjEwNjAxOTExM30.QmujsChqiFo8s59bLhLiF6QXQdBqErxS9PEQLen1vy8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('collectors').insert([{ name: 'Demo Collector', phone: '9998887776' }]).select();
  if (error) console.error(error);
  else console.log('Collector ID:', data[0].id);
}
run();

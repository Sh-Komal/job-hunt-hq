async function testRemotiveIndia() {
  try {
    const res = await fetch('https://remotive.com/api/remote-jobs?search=india');
    const data = await res.json();
    console.log('India jobs from Remotive:', data.jobs.length);
    if(data.jobs.length > 0) {
      console.log('Example:', data.jobs[0].title);
    }
  } catch(e) { console.log(e); }
}
testRemotiveIndia();

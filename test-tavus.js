// Test Tavus API connection
const TAVUS_API_KEY = "7c00871e07844d8d8e5ede34f1fc0885";
const TAVUS_REPLICA_ID = "r1a4e22fa0d9";
const TAVUS_PERSONA_ID = "p0f105b5b82e";

async function testTavusConnection() {
  try {
    // Test API key validity
    const response = await fetch('https://tavusapi.com/v2/replicas', {
      headers: {
        'x-api-key': TAVUS_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Tavus API connection successful');
      console.log('Available replicas:', data.length);
      
      // Check if your replica exists
      const replica = data.find(r => r.replica_id === TAVUS_REPLICA_ID);
      if (replica) {
        console.log('✅ Replica found:', replica.name);
      } else {
        console.log('❌ Replica not found. Available IDs:', data.map(r => r.replica_id));
      }
    } else {
      console.log('❌ Tavus API error:', response.status, await response.text());
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
}

testTavusConnection();

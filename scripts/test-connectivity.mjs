import dotenv from 'dotenv'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

async function testConnectivity() {
    console.log(`🔍 Testing connectivity to ${supabaseUrl}...`)

    const startTime = Date.now()
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        // Using global fetch (native in Node 18+)
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'GET',
            headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
            },
            signal: controller.signal
        })

        clearTimeout(timeoutId)
        const duration = Date.now() - startTime

        console.log(`✅ Status: ${response.status} ${response.statusText}`)
        console.log(`✅ Duration: ${duration}ms`)

        if (response.ok) {
            console.log('✅ Connectivity is GOOD!')
        } else {
            const text = await response.text()
            console.log(`⚠️  Response error: ${text}`)
        }
    } catch (err) {
        const duration = Date.now() - startTime
        console.error(`❌ Connection failed after ${duration}ms:`, err.message)

        if (err.name === 'AbortError') {
            console.error('❌ Request timed out (10s)! This usually means your network or firewall is blocking the connection.')
        }
    }
}

testConnectivity()

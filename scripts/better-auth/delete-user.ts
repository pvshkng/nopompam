import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

async function main() {
    const email = process.argv[2]
    const password = process.argv[3]

    if (!email || !password) {
        console.error('❌ Please provide email and password')
        console.log('Usage: npm run delete-user <email> <password>')
        process.exit(1)
    }

    try {
        const { auth } = await import('../../lib/auth')

        const session = await auth.api.signInEmail({
            body: {
                email: email,
                password: password,
            },
        })

        if (!session.token) {
            throw new Error('Failed to authenticate user')
        }

        const result = await auth.api.deleteUser({
            body: {
                password: password,
            },
            headers: {
                authorization: `Bearer ${session.token}`,
            },
        })

        console.log('✅ User deleted successfully:', result)

    } catch (error) {
        console.error('❌ Error deleting user:', error)
        process.exit(1)
    }
}

main().then(() => {
    console.log('\n✨ Script completed')
    process.exit(0)
}).catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
})

// npm run delete-user testuser@example.com TestPassword123!
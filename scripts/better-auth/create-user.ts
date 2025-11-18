import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const username = "";
const password = "";
const email = "";
const _name = "";

async function createUser() {
    try {
        const { auth } = await import("@/lib/auth")
        const user = await auth.api.signUpEmail({
            body: {
                name: _name,
                email: email,
                username: username,
                password: password,

            },
        })

        console.log('User created successfully:')

    } catch (error) {
        console.error('Error creating user:', error)
    }
}

createUser().then(() => {
    console.log('Script completed')
    process.exit(0)
}).catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
})

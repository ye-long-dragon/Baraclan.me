import bcrypt from 'bcrypt';
async function main() {
    const password = process.argv[2];
    if (!password) {
        console.error('\nUsage: npx tsx src/utils/hashPassword.ts <your-admin-password>\n');
        process.exit(1);
    }
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('\n==============================================');
    console.log('✅ Generated bcrypt hash successfully:');
    console.log(hash);
    console.log('==============================================');
    console.log('Set this in your .env file as:');
    console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
}
main().catch((err) => {
    console.error('Error generating hash:', err);
    process.exit(1);
});

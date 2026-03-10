import { OpenTDF, AuthProviders } from '@opentdf/sdk';

const authProvider = await AuthProviders.clientCredentials({
    clientId: 'opentdf',
    clientSecret: 'secret',
    oidcOrigin: oidcEndpoint,
});

// 1. See what's available on the platform
const attrs = await listAttributes(platformUrl, authProvider);
console.log(`platform has ${attrs.length} active attributes`);

// 2. Check a specific attribute exists before using it
const exists = await attributeExists(platformUrl, authProvider, 'https://opentdf.io/attr/department');
if (!exists) {
    console.error('attribute missing — create it first');
    process.exit(1);
}

// 3. Validate the specific values before encrypting
const required = ['https://opentdf.io/attr/department/value/marketing'];
try {
    await validateAttributes(platformUrl, authProvider, required);
} catch (e) {
    if (e instanceof AttributeNotFoundError) {
        console.error('required attributes missing — create them first:', e.message);
        process.exit(1);
    }
    throw e;
}

// 4. Encrypt with confidence
const client = new OpenTDF({ authProvider, platformUrl });
const ciphertext = await client.createTDF({
    source: { type: 'stream', location: dataStream },
    attributes: required,
    defaultKASEndpoint: platformUrl,
});
console.log('data encrypted successfully');



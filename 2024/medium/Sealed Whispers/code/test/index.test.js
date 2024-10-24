const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles } = require('@sliit-foss/bashaway');
const yaml = require('js-yaml');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should encrypt and apply the secret successfully', async () => {
    if (fs.existsSync('./out')) {
        fs.rmSync('./out', { recursive: true });
    }
    fs.mkdirSync('./out');
    await exec('bash -c "cat ./src/secret.yml | kubeseal --format yaml --controller-namespace kube-system --controller-name sealed-secrets > out/sealed-secret.yml"');
    await expect(exec('bash -c "kubectl get secrets/auth-service-secret"')).rejects.toThrow();
    await exec('kubectl apply -f ./out/sealed-secret.yml');
    const sealedSecretYml = fs.readFileSync('./out/sealed-secret.yml', 'utf-8');
    const sealedSecret = yaml.load(sealedSecretYml);
    expect(sealedSecret.kind).toBe('SealedSecret');
    expect(sealedSecret.metadata.name).toBe('auth-service-secret');
    const secret = await exec('bash -c "kubectl get secrets/auth-service-secret --template={{.data.JWT_SECRET}}"')
    expect(Buffer.from(secret, 'base64').toString()).toBe('vfcd43d');
});
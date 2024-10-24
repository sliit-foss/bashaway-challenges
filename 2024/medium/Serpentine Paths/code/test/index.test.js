const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, getDoc, setDoc, connectFirestoreEmulator, terminate } = require('firebase/firestore');
const { scan, shellFiles, dependencyCount, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

describe('should check installed dependencies', () => {
    let script
    beforeAll(() => {
        script = fs.readFileSync('./execute.sh', 'utf-8')
    });
    test("javacript should not be used", () => {
        restrictJavascript(script)
    });
    test("python should not be used", () => {
        restrictPython(script)
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(3)
    });
});

test('should connect to firestore and add a document', async () => {
    initializeApp({
        projectId: 'test',
    });
    const db = getFirestore();
    connectFirestoreEmulator(db, 'localhost', 9000);
    const collectionRef = collection(db, 'test');
    const docRef = doc(collectionRef, 'test-doc');
    const value = Math.random().toString(36).substring(7);
    await setDoc(docRef, { test: value });
    const docSnap = await getDoc(docRef);
    expect(docSnap.exists()).toBe(true);
    expect(docSnap.data().test).toBe(value);
    terminate(db);
});
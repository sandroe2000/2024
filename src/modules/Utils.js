export class Utils {

    uuidv4() {
        // Generate a standard UUID
        const uuid = crypto.randomUUID();

        // Extract the first character (hexadecimal digit)
        const uuidString = uuid.toString();
        const firstChar = uuidString.charAt(0);

        // Convert the first character to a letter
        const letterIndex = parseInt(firstChar, 16);
        const letter = String.fromCharCode('a'.charCodeAt(0) + letterIndex);

        // Combine the modified first character with the rest of the UUID
        const customUUID = letter + uuidString.substring(1);

        return customUUID;
    }
}
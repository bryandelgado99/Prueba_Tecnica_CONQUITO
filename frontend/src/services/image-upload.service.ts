export const uploadImageToImgur = async (file: File): Promise<string | null> => {
    try {
        const reader = new FileReader();
        return await new Promise((resolve, reject) => {
            reader.onloadend = async () => {
                const base64 = (reader.result as string).split(',')[1];
                const formData = new FormData();
                formData.append("image", base64);

                const response = await fetch("https://api.imgur.com/3/image", {
                    method: "POST",
                    headers: {
                        Authorization: "Client-ID 5467c7f9c2f5b10" // Client-ID público de Imgur
                    },
                    body: formData
                });

                const data = await response.json();
                if (data.success) resolve(data.data.link);
                else reject(new Error("Error subiendo imagen"));
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    } catch (err) {
        console.error("Error subiendo imagen:", err);
        return null;
    }
};
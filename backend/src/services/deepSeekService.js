const axios = require('axios');

class DeepSeekService {
    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY;
        this.baseURL = process.env.OPENROUTER_BASE_URL;
        this.model = process.env.OPENROUTER_MODEL;
    }

    async sendMessage(userMessage, context = {}) {
        try {
            const systemPrompt = this.buildSystemPrompt(context);

            const response = await axios.post(
                `${this.baseURL}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userMessage }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://heart.manggaleh.com',
                        'X-Title': 'HEART Shopping Assistant'
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('DeepSeek API Error:', error.response?.data || error.message);
            // Fallback response if API fails
            return "Maaf, saya sedang mengalami gangguan koneksi. Silakan coba lagi nanti.";
        }
    }

    buildSystemPrompt(context) {
        const { language = 'id', storeName, products = [] } = context;

        // Format product list for AI context
        const productListString = products.map(p =>
            `- ${p.name}: Rak ${p.location}, Rp${p.price}, ${p.halal}, Stok ${p.stock}`
        ).join('\n');

        const basePrompt = language === 'id'
            ? `Kamu adalah HEART AI Assistant untuk belanja supermarket.
Store: ${storeName || 'Various stores'}
Data Produk Real-time:
${productListString}

Tugasmu:
- Bantu customer cari produk berdasarkan Data Produk dia atas.
- JANGAN MENGARANG LOKASI. Gunakan data rak yang tersedia.
- Jika produk tidak ada di list, katakan tidak tersedia.
- Berikan lokasi produk (aisle/rak)
- Cek sertifikasi halal
- Saran resep dengan lokasi bahan
- Jawab dalam Bahasa Indonesia
- Singkat dan membantu
- SELALU sertakan proses berpikir/reasoning kamu di blok :::thinking ... ::: sebelum memberikan jawaban akhir.
- Contoh: :::thinking User mencari susu. Cek data produk... ::: Susu tersedia di Rak A1.`
            : `You are HEART AI Assistant for supermarket shopping.
Store: ${storeName || 'Various stores'}
Real-time Product Data:
${productListString}

Your role:
- Help customers find products based on the Data above.
- DO NOT HALLUCINATE LOCATIONS. Use provided rack data.
- If product is missing, say it's unavailable.
- Provide product location (aisle/rack)
- Check halal certification
- Suggest recipes with ingredient locations
- Answer in English
- Be concise and helpful
- ALWAYS include your thinking process/reasoning inside :::thinking ... ::: block before your final answer.
- Example: :::thinking User is parsing for milk. Checking product data... ::: Milk is available in Aisle A1.`;

        return basePrompt;
    }
}

module.exports = new DeepSeekService();

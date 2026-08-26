const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.improveDescription = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!description || description.trim().length < 5) {
      return res.status(400).json({ message: 'Please write a short description first.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = `You are helping a developer write a project description for a portfolio-sharing platform called Peer Project Hub. Improve the following project description to be clear, professional, and engaging in 2-3 sentences. Keep the same technical facts, don't invent new features.

Project title: ${title || 'Untitled'}
Current description: ${description}

Return ONLY the improved description text, nothing else — no preamble, no quotes.`;

    const result = await model.generateContent(prompt);
    const improvedText = result.response.text().trim();

    res.status(200).json({ improvedDescription: improvedText });
  } catch (error) {
    console.error('AI improve error:', error);
    res.status(500).json({ message: 'Failed to improve description', error: error.message });
  }
};
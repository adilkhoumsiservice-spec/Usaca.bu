import axios from "axios";
import RSSParser from "rss-parser";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const rssParser = new RSSParser();

// مصدر الأخبار (اخترت BBC كمثال آمن)
const FEED_URL = "http://feeds.bbci.co.uk/news/rss.xml";

async function fetchTrendingNews() {
    const feed = await rssParser.parseURL(FEED_URL);
    return feed.items.slice(0, 3); // أول 3 أخبار
}

async function generateArticle(title, link) {
    const prompt = `اكتب مقالا إخباريا موجزا باللغة العربية عن العنوان التالي:
    العنوان: ${title}
    المصدر: ${link}
    تجنب أي محتوى مخالف لسياسات Google.`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
    });

    return completion.choices[0].message.content;
}

(async () => {
    const news = await fetchTrendingNews();
    for (const item of news) {
        const article = await generateArticle(item.title, item.link);
        console.log("==== المقال ====");
        console.log(article);
    }
})();
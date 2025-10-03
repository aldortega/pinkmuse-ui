import NewsCard from "./NewsCard";

export default function NewsGrid({ news }) {
  if (!Array.isArray(news) || news.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-slate-800 sm:mb-8 sm:text-3xl">
        Ultimas noticias
      </h2>
      <div className="grid gap-8 sm:grid-cols-2">
        {news.map((item) => (
          <NewsCard
            key={item.id || item.slug || item.link}
            title={item.title}
            description={item.description}
            image={item.image}
            link={item.link}
            date={item.date}
          />
        ))}
      </div>
    </section>
  );
}

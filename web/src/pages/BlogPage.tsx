import { PageHero } from '../components/PageHero';
import { posts } from '../content/siteContent';

export function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Release notes, engineering notes, and workflow ideas"
        description="Static placeholder content is enough for now. The structure is ready for future posts without introducing backend work."
      />
      <section className="pb-20">
        <div className="container-shell grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="card-surface p-6">
              <p className="text-sm text-purple-200">{post.date}</p>
              <h2 className="mt-3 text-xl font-semibold text-white">{post.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{post.excerpt}</p>
              <span className="mt-5 inline-flex text-sm font-semibold text-purple-200">Placeholder post</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

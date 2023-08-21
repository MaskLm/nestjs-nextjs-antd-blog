const BlogContainer = ({ params }: { params: { slug: string } }) => {
  return <div>BlogContainer {params.slug}</div>;
};

export default BlogContainer;

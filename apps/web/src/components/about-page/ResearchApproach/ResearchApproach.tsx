import './ResearchApproach.scss';

interface ResearchApproachProps {
  id?: string;
  content: {
    heading: string;
    description: string;
    techStack: {
      title: string;
      description: string;
      items: Array<{ title: string; tech: string; description: string }>;
    };
  };
}

export const ResearchApproach: React.FC<ResearchApproachProps> = ({
  id,
  content,
}) => {
  return (
    <section id={id} className="research-approach">
      <h2 className="research-approach__heading">{content.heading}</h2>
      <p className="research-approach__text">{content.description}</p>

      <h3 className="research-approach__subheading">
        {content.techStack.title}
      </h3>
      <p className="research-approach__text">{content.techStack.description}</p>

      <ul className="research-approach__list">
        {content.techStack.items.map((item, index) => (
          <li key={index} className="research-approach__list-item">
            <strong>{item.title}:</strong> {item.tech} — {item.description}
          </li>
        ))}
      </ul>
    </section>
  );
};

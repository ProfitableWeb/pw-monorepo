import './OpenSourcePhilosophy.scss';

interface OpenSourcePhilosophyProps {
  id?: string;
  content: {
    heading: string;
    text: string;
    links: Array<{ label: string; url: string }>;
  };
}

export const OpenSourcePhilosophy: React.FC<OpenSourcePhilosophyProps> = ({
  id,
  content,
}) => {
  return (
    <section id={id} className="open-source">
      <h2 className="open-source__heading">{content.heading}</h2>
      <p className="open-source__text">{content.text}</p>

      <div className="open-source__links">
        {content.links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="open-source__link"
          >
            {link.label} →
          </a>
        ))}
      </div>
    </section>
  );
};

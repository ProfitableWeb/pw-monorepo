import './TargetAudience.scss';

interface TargetAudienceProps {
  id?: string;
  content: {
    heading: string;
    groups: string[];
  };
}

export const TargetAudience: React.FC<TargetAudienceProps> = ({
  id,
  content,
}) => {
  return (
    <section id={id} className="target-audience">
      <h2 className="target-audience__heading">{content.heading}</h2>
      <ul className="target-audience__list">
        {content.groups.map((group, index) => (
          <li key={index} className="target-audience__list-item">
            {group}
          </li>
        ))}
      </ul>
    </section>
  );
};

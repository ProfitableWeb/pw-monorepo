import './MissionSection.scss';

interface MissionSectionProps {
  id?: string;
  content: {
    heading: string;
    text: string;
    description: string;
    questions: string[];
  };
}

export const MissionSection: React.FC<MissionSectionProps> = ({
  id,
  content,
}) => {
  return (
    <section id={id} className="mission-section">
      <h2 className="mission-section__heading">{content.heading}</h2>
      <p className="mission-section__text">{content.text}</p>
      <p className="mission-section__text">{content.description}</p>

      <h3 className="mission-section__subheading">Исследовательские вопросы:</h3>
      <ul className="mission-section__list">
        {content.questions.map((question, index) => (
          <li key={index} className="mission-section__list-item">
            {question}
          </li>
        ))}
      </ul>
    </section>
  );
};

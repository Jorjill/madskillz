import './card.css';
import { useHistory } from 'react-router-dom';

export const Card = ({ skill }) => {
    const history = useHistory();
    const { id, name } = skill;
    const imageUrl = new URL(`../../images/${id}.png`, import.meta.url).href

    const onClickSkill = () => {
        history.push(`/skill/${skill.id}`);
    }
    
    return(
        <div className='card-container' key={id}>
            <div onClick={onClickSkill}>
                <img src={imageUrl} alt="Lamp" width="150" height="80"/>
                <h2>{name}</h2>
            </div>
        </div>
    );
}
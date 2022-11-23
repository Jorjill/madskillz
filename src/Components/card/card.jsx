import './card.css';
import javaimg from '../../images/1.png';


export const Card = ({ skill }) => {

    const { id, name } = skill;
    
    return(
        <div className='card-container' key={id}>
            <div>
                <img src={require(`../../images/${id}.png`)} alt="Lamp" width="150" height="80"/>
                <h2>{name}</h2>
            </div>
        </div>
    );
}
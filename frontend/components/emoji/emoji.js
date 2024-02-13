import { useEffect, useState } from 'react'
import styles from '../../styles/modules/emoji.module.css'


export default function EmojiForm({toggleEmojicon, setSelectedEmoji }) {

    const [emojiData, setEmojiData] = useState(null)
    const [searchTerm, setSearchTerm] = useState('');
   

    useEffect(() => {
        const fetchEmojis = async () => {
            // Attention ici faux pas modifier la clé
            try {
                const response = await fetch("https://emoji-api.com/emojis?access_key=0d4f3866577e4585dd4c49cf5de9708590fabfc0", {
                    method: 'GET',
                });

                // Vérifier le statut de la réponse
                if (!response.ok) {
                    console.error('Failed to fetch profile data');
                }
                // Analyser la réponse JSON
                const data = await response.json();
                setEmojiData(data)

            } catch (error) {
                console.error('Error fetching profile data:', error.message);
            }
        }
        fetchEmojis()

    }, [])

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);

    };

    // Filtrez les émojis en fonction de la valeur de la recherche en utilisant la propriété 'unicodeName'
    const filteredEmojis = emojiData?.filter(emoji =>
        emoji.unicodeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleEmojiClick = (emoji) => {
        setSelectedEmoji(prevValue => prevValue + emoji);
    };

    return (
        <div className={styles.popup}>
            <div className={styles.form}>
                <div className={styles.contenInput}>
                    <input
                        placeholder="Search emoji..."
                        title="Search emoji"
                        name="emoji"
                        type="text"
                        className={styles.input_field}
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <i className="fa-solid fa-xmark" onClick={toggleEmojicon}></i>
                </div>
                <div className={styles.listes}>
                    {
                        filteredEmojis && filteredEmojis.map((item, index) => (
                            <span key={index}
                                className={`${item.slug}`}
                                onClick={() => handleEmojiClick(item.character)}  >{item.character}</span>
                        ))
                    }
                </div>

            </div>
        </div>
    );
}

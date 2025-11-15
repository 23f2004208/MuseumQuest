import smithsonianImg from './images/smithsonian.jpg';
import vaticanImg from './images/vaticanmuseums.webp';
import metropolitanImg from './images/metropolitan.jpg';
import britishMuseumImg from './images/britishmuseum.avif';
import tokyoNationalMuseumImg from './images/tokyo.jpg';
import egyptianMuseumImg from './images/egypt.webp';
import stateHermitageMuseumImg from './images/statehermitage.webp';
import apartheidMuseumImg from './images/apartheidmuseum.jpg';
import nationalMuseumOfChinaImg from './images/nationalmuseumofchina.jpg';

export const museums = [
    {
        id: 1,
        name: "The Louvre",
        lat: 48.8606,
        lng: 2.3376,
        city: "Paris",
        state: "Île-de-France",
        country: "France",
        yearFounded: 1793,
        description: "The Louvre Museum in Paris, France is the world’s largest art museum and one of the most iconic cultural institutions in history. Originally built as a fortress in 1190 by King Philip II, it was later transformed into a royal palace before officially becoming a public museum in 1793 during the French Revolution. Today, the Louvre houses 35,000 artworksfrom an immense collection of over 500,000 pieces, and is renowned for masterpieces such as the Mona Lisa, the Venus de Milo, the Winged Victory of Samothrace, and Liberty Leading the People. Organized into eight departments, the museum stands as a global symbol of artistic heritage and human creativity.",
        image: "https://commons.wikimedia.org/wiki/File:Paris_-_Louvre_7499.jpg"
    },
    {
        id: 2,
        name: "British Museum",
        lat: 51.5194,
        lng: -0.1270,
        city: "London",
        state: "London",
        country: "United Kingdom",
        yearFounded: 1753,
        description: "The British Museum in London, England, founded in 1753, is one of the oldest public museums in the world. It opened to the public in 1759 with free admission, establishing a tradition of accessibility that continues today. Renowned for its vast collection spanning over 2 million years of human history, the museum houses more than 8 million objectsthat illuminate global civilizations and cultural development. As a leading center for archaeology, research, conservation, and world cultural history, the British Museum remains one of the most significant institutions dedicated to preserving and interpreting the human story.",
        image: britishMuseumImg
    },
    {
        id: 3,
        name: "Metropolitan Museum of Art",
        lat: 40.7794,
        lng: -73.9632,
        city: "New York",
        state: "New York",
        country: "United States",
        yearFounded: 1870,
        description: "The Metropolitan Museum of Art in New York City, founded in 1870 to make art and art education accessible to the American public, has grown into one of the largest and most visited museums in the world. Its vast collection includes more than two million works of art, spanning thousands of years and cultures. Beyond its exhibitions, the Met is widely recognized for hosting the prestigious Met Gala each year and is famously known for its iconic grand staircase, a landmark symbol of the museum’s elegance and cultural significance.",
        image: metropolitanImg
    },
    {
        id: 4,
        name: "Vatican Museums",
        lat: 41.9065,
        lng: 12.4536,
        city: "Vatican City",
        state: "Vatican City",
        country: "Vatican City",
        yearFounded: 1506,
        description: "The Vatican Museums in Vatican City, Rome are among the world’s most significant and expansive cultural complexes. Founded in 1506 by Pope Julius II, the museums have grown into a vast network of 26 museums and galleries, showcasing centuries of artistic and historical treasures. Although the collection holds over 70,000 artworks, only about 20,000 are on display, offering visitors a curated journey through some of humanity’s greatest achievements. The Vatican Museums are especially renowned for masterpieces by Michelangelo, Leonardo da Vinci, and the celebrated Raphael Rooms, making them a cornerstone of global art and religious history.",
        image: vaticanImg
    },
    {
        id: 5,
        name: "Tokyo National Museum",
        lat: 35.71889,
        lng: 139.77639,
        city: "Tokyo",
        state: "Tokyo",
        country: "Japan",
        yearFounded: 1872,
        description: "The Tokyo National Museum, located in Tokyo, Japan, is the country’s oldest and largest museum, founded in 1872. It is dedicated to preserving and showcasing Japanese art and archaeology, while also featuring significant works from China, Korea, India, and Southeast Asia. The museum’s vast collection includes over 120,000 objects, among them 89 National Treasures and 644 Important Cultural Properties, reflecting the depth of Asia’s artistic and historical heritage. Famous artifacts such as ancient samurai armor and swords and Buddhist statues and ritual objectshighlight the museum’s role as a major center for cultural preservation and education.",
        image: tokyoNationalMuseumImg
    },
    {
        id: 6,
        name: "National Museum of China",
        lat: 39.9042,
        lng: 116.3974,
        city: "Beijing",
        state: "Beijing",
        country: "China",
        yearFounded: 2003,
        description: "The National Museum of China, located in Beijing, is one of the world’s most significant cultural institutions and the largest museum in the world by floor space. Established in 2003 through the merger of the Museum of the Chinese Revolution and the National Museum of Chinese History, it officially reopened in 2011 after a major renovation. The museum is dedicated to showcasing the history, art, and culture of China—from prehistoric times to the modern era. With a collection of over one million artifacts, it features iconic pieces such as the Simuwu Ding, Han Dynasty jade burial suits, and numerous Buddhist statues. Through its extensive exhibitions on Ancient China, Modern China, and Chinese art, the museum serves as a comprehensive guide to the nation’s rich cultural heritage.",
        image: nationalMuseumOfChinaImg
    },
    {
        id: 7,
        name: "State Hermitage Museum",
        lat: 59.9398,
        lng: 30.3146,
        city: "Saint Petersburg",
        state: "Saint Petersburg",
        country: "Russia",
        yearFounded: 1764,
        description: "The State Hermitage Museum in St. Petersburg, Russia, founded in 1764 by Catherine the Great, is one of the largest and oldest museums in the world. Opened to the public in 1852, it has grown into an expansive complex of six main buildings, the most iconic being the Winter Palace. The Hermitage houses over three million items, making it one of the most extensive collections on the planet. Its galleries feature masterpieces by renowned artists including Leonardo da Vinci, Rembrandt, Michelangelo, Raphael, Picasso, and Van Gogh. Today, the museum stands as one of the most visited cultural institutions globally, celebrated for its immense artistic and historical significance.",
        image: stateHermitageMuseumImg
    },
    {
        id: 8,
        name: "Apartheid Museum",
        lat: -26.2379,
        lng: 28.0084,
        city: "Johannesburg",
        state: "Gauteng",
        country: "South Africa",
        yearFounded: 2001,
        description: "The Apartheid Museum in Johannesburg, South Africa, opened in 2001, is the first museum dedicated to telling the full story of apartheid. It focuses on the rise and fall of the apartheid system from 1948 to 1994, illustrating how racial segregation shaped South African society. From the very entrance—where visitors are separated into “white” and “non-white” categories—the museum immerses guests in the lived realities of apartheid. Its powerful exhibits use photographs, film footage, archival documents, and personal stories to capture daily life under the regime. The museum also explores major themes such as the creation of racial laws, forced removals, segregated neighborhoods, political resistance and activism, and the life and legacy of Nelson Mandela. Today, the Apartheid Museum serves as a major center for education, remembrance, and social justice awareness, helping future generations understand the struggles that shaped modern South Africa.",
        image: apartheidMuseumImg
    },
    {
        id: 9,
        name: "Egyptian Museum",
        lat: 30.0478,
        lng: 31.2336,
        city: "Cairo",
        state: "Cairo",
        country: "Egypt",
        yearFounded: 1902,
        description: "The Egyptian Museum in Cairo, Egypt, opened in 1902, is one of the oldest and most important archaeological museums in the Middle East. Home to the world’s largest collection of ancient Egyptian artifacts, the museum houses over 120,000 objects, although only a portion is on display. It is especially renowned for its extensive collections from the Old, Middle, and New Kingdoms, as well as the Greco-Roman period, offering a comprehensive look into Egypt’s long and vibrant history. The museum is most famous for the spectacular treasures of Tutankhamun’s tomb, including the iconic gold funerary mask, along with gold shrines, jewelry, chariots, and everyday items. With its collection of mummies and its distinctive Victorian-style architecture, the Egyptian Museum remains a central guardian of Egypt’s ancient heritage.",
        image: egyptianMuseumImg
    },
    {
        id: 10,
        name: "Smithsonian National Museum of Natural History",
        lat: 38.8913,
        lng: -77.0261,
        city: "Washington, D.C.",
        state: "District of Columbia",
        country: "United States",
        yearFounded: 1910,
        description: "The Smithsonian Institution in Washington, D.C. is the world’s largest museum, education, and research complex. Established in 1846 with funds from the Englishman James Smithson, it has grown into a vast network of 21 museumsand 14 education and research centers, along with the renowned National Zoo. Today, the Smithsonian stands as a cornerstone of cultural preservation, scientific exploration, and public learning in the United States",
        image: smithsonianImg
    }
];

/** Just an example!
 *  ----------------
 *  An example component which imports it's own stylesheet
**/

/** imports
 *  -------
**/
import React from 'react';

import 'Shared/styles/components/Example.scss';

/** variables
 *  ---------
**/
const title = 'Three Paragraphs from Moby Dick by Herman Melville';

let paras = [
  'Now, when with royal Tranquo I visited this wondrous whale, and saw the skull an altar, and the artificial smoke ascending from where the real jet had issued, I marvelled that the king should regard a chapel as an object of vertu. He laughed. But more I marvelled that the priests should swear that smoky jet of his was genuine. To and fro I paced before this skeleton brushed the vines aside broke through the ribs and with a ball of Arsacidean twine, wandered, eddied long amid its many winding, shaded colonnades and arbours. But soon my line was out; and following it back, I emerged from the opening where I entered. I saw no living thing within; naught was there but bones.',
  'Cutting me a green measuring-rod, I once more dived within the skeleton. From their arrow-slit in the skull, the priests perceived me taking the altitude of the final rib, "How now!" they shouted; "Dar\'st thou measure this our god! That\'s for us." "Aye, priests well, how long do ye make him, then?" But hereupon a fierce contest rose among them, concerning feet and inches; they cracked each other\'s sconces with their yard-sticks the great skull echoed and seizing that lucky chance, I quickly concluded my own admeasurements.',
  'These admeasurements I now propose to set before you. But first, be it recorded, that, in this matter, I am not free to utter any fancied measurement I please. Because there are skeleton authorities you can refer to, to test my accuracy. There is a Leviathanic Museum, they tell me, in Hull, England, one of the whaling ports of that country, where they have some fine specimens of fin-backs and other whales. Likewise, I have heard that in the museum of Manchester, in New Hampshire, they have what the proprietors call "the only perfect specimen of a Greenland or River Whale in the United States." Moreover, at a place in Yorkshire, England, Burton Constable by name, a certain Sir Clifford Constable has in his possession the skeleton of a Sperm Whale, but of moderate size, by no means of the full-grown magnitude of my friend King Tranquo\'s.',
];

paras = paras.map(p => [
  p.substring(0, p.indexOf(' ') + 1),
  p.substring(p.indexOf(' ') + 1),
]);

/** Component content
 *  -----------------
**/
const Example = () => (
  <div id="example" className="Example wrap">
    <h1>
      {title}
    </h1>

    <p>
      <strong>{paras[0][0]}</strong>
      {paras[0][1]}
    </p>

    <p>
      <strong>{paras[1][0]}</strong>
      {paras[1][1]}
    </p>

    <p>
      <strong>{paras[2][0]}</strong>
      {paras[2][1]}
    </p>

    <p>
      <a href="#example">
        back to top
      </a>
    </p>
  </div>
);

export default Example;

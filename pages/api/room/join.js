import rooms from "../../../data/rooms";
import { uuid } from 'uuidv4';
import withSession from "../../../lib/session";

import { withIronSession } from 'next-iron-session';

export default withSession(async (req, res) => {
    const { playername, roomname } = req.body;

    const room = rooms.find(r => r.name == roomname);

    if(room) {
        const id = uuid();
        const outro  = room.players.find(p => p.name == playername);
        const player = { id: id, name: playername, rightAnswers: 0, isReady: false};

        if(!outro) {
            if(!room.isStarted){
                room.players.push(player);

                req.session.set("player", player);

                await req.session.save();

                return res.json({ join: true, message: "Jogador entrou!" });
            }

            return res.json({ join: false, message: "Essa sala já iniciou!" });   
        }
        
        return res.json({ join: false, message: "Já existe um jogador com esse nome!" });
    }

    return res.json({ join: false, message: `A sala ${roomname} não existe.` });
});

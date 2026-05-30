import { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Collapse, IconButton
} from '@mui/material';
import { get } from '../../services/requestHelper';

function FightRow({ fight, fighters }) {
    const [open, setOpen] = useState(false);

    const getName = (id) => fighters[id] ?? id.slice(0, 8) + '…';

    return (
        <>
            <TableRow>
                <TableCell>{new Date(fight.createdAt).toLocaleString()}</TableCell>
                <TableCell>{getName(fight.fighter1)}</TableCell>
                <TableCell>{getName(fight.fighter2)}</TableCell>
                <TableCell><b>{getName(fight.winner)}</b></TableCell>
                <TableCell>{fight.log.length}</TableCell>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen((o) => !o)}>
                        {open ? '▲' : '▼'}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={6} sx={{ py: 0 }}>
                    <Collapse in={open} unmountOnExit>
                        <Box sx={{ m: 1 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Round</TableCell>
                                        <TableCell>{getName(fight.fighter1)} shot</TableCell>
                                        <TableCell>{getName(fight.fighter2)} shot</TableCell>
                                        <TableCell>{getName(fight.fighter1)} HP</TableCell>
                                        <TableCell>{getName(fight.fighter2)} HP</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fight.log.map((entry) => (
                                        <TableRow key={entry.round}>
                                            <TableCell>{entry.round}{entry.fighter1CriticalHit ? ' ⚡' : ''}{entry.fighter2CriticalHit ? ' ⚡' : ''}</TableCell>
                                            <TableCell>{entry.fighter1Shot}</TableCell>
                                            <TableCell>{entry.fighter2Shot}</TableCell>
                                            <TableCell>{entry.fighter1Health}</TableCell>
                                            <TableCell>{entry.fighter2Health}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default function FightHistory() {
    const [fights, setFights] = useState([]);
    const [fighters, setFighters] = useState({});
    const [show, setShow] = useState(false);

    const load = async () => {
        const [fightData, fighterData] = await Promise.all([
            get('fights'),
            get('fighters'),
        ]);
        if (fightData && !fightData.error) {
            setFights([...fightData].reverse());
        }
        if (fighterData && !fighterData.error) {
            const map = {};
            fighterData.forEach((f) => { map[f.id] = f.name; });
            setFighters(map);
        }
    };

    useEffect(() => {
        if (show) load();
    }, [show]);

    return (
        <Box sx={{ width: '70%', mx: 'auto', mt: 3 }}>
            <Button variant="outlined" onClick={() => setShow((s) => !s)}>
                {show ? 'Hide History' : 'Show Fight History'}
            </Button>
            {show && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>Fight History</Typography>
                    {fights.length === 0 ? (
                        <Typography color="text.secondary">No fights yet.</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Fighter 1</TableCell>
                                        <TableCell>Fighter 2</TableCell>
                                        <TableCell>Winner</TableCell>
                                        <TableCell>Rounds</TableCell>
                                        <TableCell>Log</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fights.map((fight) => (
                                        <FightRow key={fight.id} fight={fight} fighters={fighters} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            )}
        </Box>
    );
}

import {
    Button,
    Container,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    IconButton,
} from '@material-ui/core';
import { Add, Delete } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Account } from '../../../api/service';

const Team = () => {
    const [users, setUsers] = useState(null);

    useEffect(() => {
        Account.getTeamUsers().then((data) => setUsers(data));
    }, []);

    const handleDelete = (email) => {
        Account.deleteTeamUser(email).then(() => {
            let usersCopy = [...users];
            let index = usersCopy.findIndex((x) => x.email === email);
            usersCopy.splice(index, 1);
            setUsers(usersCopy);
        });
    };

    return (
        users && (
            <Container maxWidth="md">
                <Button
                    color="primary"
                    variant="outlined"
                    size="large"
                    startIcon={<Add />}
                    component={Link}
                    to="/settings/team/add"
                >
                    Add user
                </Button>

                <TableContainer component={Paper} style={{ marginTop: '16px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>First name</TableCell>
                                <TableCell align="right">Last name</TableCell>
                                <TableCell align="right">Email</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((row) => (
                                <TableRow key={row.email}>
                                    <TableCell component="th" scope="row">
                                        {row.firstName}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.lastName}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.email}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() =>
                                                handleDelete(row.email)
                                            }
                                            style={{ padding: 0 }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        )
    );
};

export default Team;

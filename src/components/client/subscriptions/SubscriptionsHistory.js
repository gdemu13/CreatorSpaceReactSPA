import { useState } from 'react';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import moment from 'moment';

function Row({ subscription }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {moment(subscription.dateCreated).format(
                        'YYYY-MM-DD HH:mm:ss'
                    )}
                </TableCell>
                <TableCell>
                    {subscription.dateEnded
                        ? moment(subscription.dateEnded).format(
                              'YYYY-MM-DD HH:mm:ss'
                          )
                        : 'N/A'}
                </TableCell>
                <TableCell>{subscription.tierTitle}</TableCell>
                <TableCell>{subscription.tierPrice}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                            >
                                Payment History
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Currency</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {subscription.payments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>
                                                {moment(
                                                    payment.dateCreated
                                                ).format('YYYY-MM-DD HH:mm:ss')}
                                            </TableCell>
                                            <TableCell>
                                                {payment.totalAmount}
                                            </TableCell>
                                            <TableCell>
                                                {payment.currency}
                                            </TableCell>
                                            <TableCell>
                                                {payment.status}
                                            </TableCell>
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

const SubscriptionHistory = ({ subscriptions }) => {
    return (
        <>
            <Box my={3}>
                <Typography variant="h4">
                    Subscription & Payment History
                </Typography>
            </Box>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Create Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Tier Title</TableCell>
                            <TableCell>Tier Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subscriptions.map((subscription) => (
                            <Row
                                key={subscription.id}
                                subscription={subscription}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default SubscriptionHistory;

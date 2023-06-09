import { Box, Button, CircularProgress, IconButton, Input, Typography } from "@mui/material";
import MessageList from "../MessageList/MessageList";
import SendIcon from '@mui/icons-material/Send'
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getMessageAction } from "../../store/asyncActions.ts/messageAsyncActions";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "../../store";
import { CurrentMessageActionTypes } from "../../store/actions/currentMessageAction";

import { AccountCircle, RestartAlt } from '@mui/icons-material';
import { logoutAction } from "../../store/asyncActions.ts/authAsyncAction";
import { SettingsModal } from "../SettingsModal.tsx/SettingsModal";
import { Information } from "../Information/Information";

export const Chat = () => {
    const dispatch: ThunkDispatch<RootState, null, AnyAction> = useAppDispatch();
    const messages = useAppSelector(state => state.messages.messages);
    const error = useAppSelector(state => state.messages.errorMsg);
    const [inputValue, setInputValue] = useState('');
    const login = useAppSelector(state => state.auth.login);
    const isLoading = useAppSelector(state => state.messages.isLoading);

    const currentMessage = useAppSelector(state => state.currentMessage.message);

    const isModalOpen = useMemo<boolean>(() => Boolean(currentMessage), [currentMessage]);

    const handleLogOut = () => {
        dispatch(logoutAction());
    };

    useEffect(() => {
        handleGetMessages();
    }, []);

    const handleGetMessages = () => {
        dispatch(getMessageAction());
    };

    const handleChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            handleFormSubmit(event);
        }
    };

    const handleFormSubmit = (event: any) => {
        event.preventDefault();

        const newMessage = {
            message: inputValue
        };

        dispatch({
            type: CurrentMessageActionTypes.SET_MESSAGE,
            payload: newMessage
        });

        setInputValue('');
    };

    return (
        <>
            <Box
                width={'100vw'}
                minHeight={'80px'}
                zIndex={3}
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundImage: 'linear-gradient(0deg,rgba(53,55,64,0), #353740 50%)',
                }}
            >
                <Box
                    maxWidth={'720px'}
                    margin={'auto'}
                    paddingX={'15px'}
                    sx={{
                        mt: '10px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <AccountCircle
                            fontSize="large"
                            sx={{
                                color: 'white',
                                mr: '10px'
                            }}
                        />
                        <Typography
                            sx={{
                                color: 'white',
                            }}
                        >
                            {login}
                        </Typography>
                    </Box>
                    {isLoading &&
                        <CircularProgress
                            size={30}
                            sx={{
                                color: 'lightgray',
                            }}
                        />}
                    {(!isLoading && error.length !== 0 && messages.length === 0) &&
                        <IconButton
                            onClick={handleGetMessages}
                            sx={{
                                height: '35px',
                                width: '35px',
                            }}
                        >
                            <RestartAlt
                                sx={{
                                    color: 'lightgray',
                                }}
                            />
                        </IconButton>}
                    <Button
                        onClick={handleLogOut}
                        sx={{
                            color: 'lightgray',
                        }}
                    >
                        Log Out
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                width: '100vw',
                height: '100vh',
                bgcolor: '#343541',

                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'end',
            }}>
                {messages.length !== 0
                    ? <MessageList messages={messages} />
                    : <Information />}
            </Box>
            <Box
                width={'100vw'}
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    backgroundImage: 'linear-gradient(180deg,rgba(53,55,64,0),#353740 58.85%)',
                    zIndex: 1
                }}
            >
                <Box
                    component="form"
                    noValidate
                    maxWidth={'750px'}
                    paddingX={'10px'}
                    margin={'auto'}
                    onSubmit={(event) => handleFormSubmit(event)}
                >
                    <Box
                        sx={{
                            position: 'relative',
                        }}
                    >
                        <Input
                            required
                            fullWidth
                            autoComplete='false'
                            type="submit"
                            placeholder="Message is required"
                            value={inputValue}
                            onChange={handleChangeMessage}
                            onKeyDown={(event) => handleKeyDown(event)}
                            sx={{
                                mb: 1,
                                maxHeight: '200px',
                                overflow: 'hidden',
                                backgroundColor: '#40414F',
                                borderRadius: '8px',
                                padding: 1,
                                caretColor: 'white',
                                boxShadow: 2,
                                color: 'white',
                                '& textarea': {
                                    padding: '4px, 0px, 0px',
                                    pr: '30px',
                                    overflow: 'hidden',
                                },
                            }}
                            multiline
                            disableUnderline
                        />
                        <IconButton
                            type="submit"
                            sx={{
                                position: 'absolute',
                                right: 0,
                                bottom: '6px',
                                borderRadius: '40%'
                            }}
                        >
                            <SendIcon />
                        </IconButton>
                    </Box>
                    <Typography
                        color={'error.main'}
                        textAlign={'center'}
                        fontSize={12}
                        sx={{
                            mb: 1
                        }}
                    >
                        {error}
                    </Typography>
                    <Typography
                        color={'rgba(255, 255, 255, 0.5)'}
                        textAlign={'center'}
                        fontSize={14}
                        sx={{
                            mb: 1
                        }}
                    >
                        Write your message, choose cipher method and cipher key
                    </Typography>
                </Box>
            </Box>
            <SettingsModal
                isModalOpen={isModalOpen}
            />
        </>
    );
};

import { handleOnAuthenticate } from "@/request/auth";
import { zodauthorizedEmail, zodemail } from "@/shared/types/zod";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import type { EmailValidity } from "./Authenticate";

interface AuthFormProps {
    autoFocus: boolean;
    email: string;
    userId?: string;
    setEmail: (email: string) => void;
    isEmailValid: EmailValidity;
    setIsEmailValid: (emailHelper: EmailValidity) => void;
    emailHelper: string;
    setEmailHelper: (emailHelper: string) => void;
}

export function AuthForm({
    autoFocus,
    email,
    userId,
    setEmail,
    isEmailValid,
    setIsEmailValid,
    emailHelper,
    setEmailHelper,
}: AuthFormProps) {
    const [isTrusted, setIsTrusted] = React.useState<boolean>(true);

    function validateEmail(emailToValidate: string) {
        if (emailToValidate === "") {
            setIsEmailValid("incorrect");
            setEmailHelper(" ");
            return;
        }
        const result = zodemail.safeParse(emailToValidate);
        if (!result.success) {
            const formatted = result.error.format();
            setIsEmailValid("incorrect");
            setEmailHelper(formatted._errors[0]);
        } else {
            const result = zodauthorizedEmail.safeParse(emailToValidate);
            if (!result.success) {
                setIsEmailValid("valid_unauthorized");
                setEmailHelper(
                    "Please provide a valid @essec.edu email address"
                );
            } else {
                setIsEmailValid("valid_authorized");
                setEmailHelper(" ");
            }
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Box sx={{ mt: 1 }}>
                <TextField
                    autoFocus={autoFocus}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="ESSEC Email Address"
                    placeholder="yuting.jiang@essec.edu"
                    name="email"
                    error={
                        email !== "" &&
                        isEmailValid !== "valid_authorized"
                    }
                    helperText={emailHelper} // must always be set to keep same height (see link at variable definition)
                    value={email}
                    onChange={(event: React.FocusEvent<HTMLInputElement>) => {
                        if (event.target.value !== email) {
                            const newEmail = event.target.value.toLowerCase();
                            setEmail(newEmail);
                            validateEmail(newEmail);
                        }
                    }}
                />
                <Box>
                    <FormControl
                        error={!isTrusted}
                        component="fieldset"
                        variant="standard"
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    required
                                    checked={isTrusted}
                                    onChange={() => setIsTrusted(!isTrusted)}
                                />
                            }
                            label={
                                <Typography variant={"body2"}>
                                    This is not a shared device - stay logged-in
                                </Typography>
                            }
                        />
                    </FormControl>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={() => handleOnAuthenticate(email, userId)}
                        disabled={
                            isEmailValid !== "valid_authorized" ||
                            !isTrusted
                        }
                    >
                        Register / Log in
                    </Button>
                </Box>
            </Box>
            <Box sx={{ mt: 3 }}>
                <Typography>This version is currently reserved for ESSEC Business School. Stay tuned for the Beta release!</Typography>
                <Button
                    fullWidth
                    variant="outlined"
                    rel="noreferrer noopener"
                    target="_blank"
                    href="https://fmphp086zpk.typeform.com/to/O9wdAe6o"
                    sx={{ mt: 3, mb: 2 }}
                    endIcon={
                        <FontAwesomeIcon
                            size="2xs"
                            icon={faArrowUpRightFromSquare}
                        />
                    }
                >
                    Join our Waitlist
                </Button>
            </Box>
        </Box>
    );
}

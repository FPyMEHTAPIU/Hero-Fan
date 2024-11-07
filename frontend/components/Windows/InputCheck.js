const allowedPattern = /^[a-zA-Z0-9_@$%!^&*]+$/;

const handleBeforeInput = (e, setMessage) => {
    const char = e.data;

    if (char && !allowedPattern.test(char)) {
        setMessage('Only allowed characters: a-z, A-Z, 0-9, _@$%!^&*');
        e.preventDefault();
    } else {
        setMessage('');
    }
};

export default handleBeforeInput;
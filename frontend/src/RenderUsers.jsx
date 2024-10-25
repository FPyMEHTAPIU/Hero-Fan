import './CharsUsers.css'

const renderUsers = (currentUsers, navigate ) => {

    return currentUsers.map((user) => (
        <button
            className="user" key={user.id}
            onClick={() => navigate(`/user/${user.id}`)}
        >
            <img src="../includes/User%20Default_Cover.svg" alt={user.login} className="user-image"/>
            <div className="char-name">
                <p className="char-name">{user.login}</p>
            </div>
        </button>
    ));
};

export default renderUsers;
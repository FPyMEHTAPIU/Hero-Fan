const renderUsers = (currentUsers, navigate ) => {

    return currentUsers.map((user) => (
        <button
            className="hero user" key={user.id}
            onClick={() => navigate(`/user/${user.id}`)}
        >
            <img src="/User%20Default_Cover.svg" alt={user.login} className="user-image"/>
            <div className="char-name">
                <p className="user-name">{user.login}</p>
            </div>
        </button>
    ));
};

export default renderUsers;
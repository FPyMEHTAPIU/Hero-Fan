import React from "react";
import { useNavigate } from "react-router-dom";
import './App.css'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const navigate = useNavigate();

    const handlePageChange = (pageNumber) => {
        onPageChange(pageNumber);
        navigate.push(`/${pageNumber}`);
    };

    const renderPaginationButtons = () => {
        let buttons = [];
        for (let i = 1; i <= totalPages; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    disabled={i === currentPage}
                    className={i === currentPage ? "active-page-button" : "page-button"} //TODO: add styles to App.css
                >{i}
                </button>
            );
        };
        return buttons;
    };

    return (
        <div className="pagination">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="page-button page-button-left"
            >
                <img src="../includes/Left_arrow.svg" alt="Previous page"/>
            </button>
            <div className="divider"></div>
            {renderPaginationButtons()}
            <div className="divider"></div>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="page-button page-button-right"
            >
                <img src="../includes/Right_arrow.svg" alt="Next page"/>
            </button>
        </div>
    );
};

export default Pagination;
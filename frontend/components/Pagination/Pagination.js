import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const visiblePages = [];

    // first page
    visiblePages.push(
        <button
            key="first"
            onClick={() => onPageChange(1)}
            className="page-button page-button-left"
            disabled={currentPage === 1}
        >
            <img src="/first_arrow.svg" alt="First page"/>
        </button>,
        <div className="divider"></div>,
        <button
            key="prev"
            onClick={() => onPageChange(currentPage - 1)}
            className="page-button"
            disabled={currentPage === 1}
        >
            <img src="/Left_arrow.svg" alt="Previous page"/>
        </button>,
        <div className="divider"></div>
    );

    // calculate and fill middle pages
    const previousPage = Math.max(1, currentPage - 1);
    const nextPage = Math.min(totalPages, currentPage + 1);

    for (let i = previousPage; i <= nextPage; i++) {
        visiblePages.push(
            <button
                key={i}
                onClick={() => onPageChange(i)}
                className={currentPage === i ? "page-button active" : "page-button"}
                disabled={currentPage === i}
            >
                {i}
            </button>,
            <div className="divider"></div>
        );
    }

    // divider from the end
    if (currentPage < totalPages - 1) {
        visiblePages.push(
            <button key="dots-next" className="page-button disabled">
                ...
            </button>,
            <div className="divider"></div>
        );
    }

    // last page
    visiblePages.push(
        <button
            key="next"
            onClick={() => onPageChange(currentPage + 1)}
            className="page-button"
            disabled={currentPage === totalPages}
        >
            <img src="/Right_arrow.svg" alt="Next page"/>
        </button>,
        <div className="divider"></div>,
        <button
            key="last"
            onClick={() => onPageChange(totalPages)}
            className="page-button page-button-right"
            disabled={currentPage === totalPages}
        >
            <img src="/last_arrow.svg" alt="Next page"/>
        </button>
    );

    return <div key="pagination" className="pagination">{visiblePages}</div>;
};

export default Pagination;
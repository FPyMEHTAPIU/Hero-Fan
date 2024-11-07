import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const visiblePages = [];

    // first page
    visiblePages.push(
        <button
            key="prev"
            onClick={() => onPageChange(currentPage - 1)}
            className="page-button page-button-left"
            disabled={currentPage === 1}
        >
            <img src="/Left_arrow.svg" alt="Previous page"/>
        </button>,
        <div key="divider" className="divider"></div>,
        <button
            key={1}
            onClick={() => onPageChange(1)}
            className={currentPage === 1 ? "page-button active" : "page-button"}
            disabled={currentPage === 1}
        >
            1
        </button>,
        <div key="divider" className="divider"></div>
    );

    // divider from the start
    if (currentPage > 3) {
        visiblePages.push(
            <button key="dots-prev" className="page-button disabled">
                ...
            </button>,
            <div key="divider" className="divider"></div>
        );
    }

    // calculate and fill middle pages
    const previousPage = Math.max(2, currentPage - 1);
    const nextPage = Math.min(totalPages - 1, currentPage + 1);

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
            <div key="divider" className="divider"></div>
        );
    }

    // divider from the end
    if (currentPage < totalPages - 2) {
        visiblePages.push(
            <button key="dots-next" className="page-button disabled">
                ...
            </button>,
            <div key="divider" className="divider"></div>
        );
    }

    // last page
    visiblePages.push(
        <button
            key={totalPages}
            onClick={() => onPageChange(totalPages)}
            className={currentPage === totalPages ? "page-button active" : "page-button"}
            disabled={currentPage === totalPages}
        >
            {totalPages}
        </button>,
        <div key="divider" className="divider"></div>,
        <button
            key="next"
            onClick={() => onPageChange(currentPage + 1)}
            className="page-button page-button-right"
            disabled={currentPage === totalPages}
        >
            <img src="/Right_arrow.svg" alt="Next page"/>
        </button>
    );

    return <div key="pagination" className="pagination">{visiblePages}</div>;
};

export default Pagination;
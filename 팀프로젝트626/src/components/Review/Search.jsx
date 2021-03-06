import React from 'react';
import { useRef } from 'react';
import styles from './CSS/search.module.css'

//πκ²μμ»΄ν¬λνΈ
const Search = ({onSearch}) => {

    const inputRef = useRef()

    const onSubmit = () => {

        onSearch(inputRef.current.value)
        inputRef.current.value = ''
    }


    return (
        <div className={styles.container}>
            <span className={styles.title}>ν΄μνκ·Έκ²μ</span>
            <input ref={inputRef} type="text" />
            <button
            onClick={onSubmit}
            className={styles.search}
            >
                <i class="fa-solid fa-magnifying-glass"></i>
            </button> 
        </div>
    );
};

export default Search;
const ensureAuthorization = require('../auth');
const jwt = require('jsonwebtoken');
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const toggleLike = (req, res) => {
    const book_id = req.params.id;
    const authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: '로그인 세션이 만료되었습니다. 다시 로그인 해주세요.'
        });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: '잘못된 토큰입니다.'
        });
    }

    const checkSql = 'SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?';
    const values = [authorization.id, book_id];

    conn.query(checkSql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        if (results.length > 0) {
            const deleteSql = 'DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?';
            conn.query(deleteSql, values, (err2, deleteResults) => {
                if (err2) {
                    console.log(err2);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }
                return res.status(StatusCodes.OK).json({
                    liked: false,
                    message: '좋아요가 취소되었습니다.'
                });
            });
        }
        else {
            const insertSql = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)';
            conn.query(insertSql, values, (err3, insertResults) => {
                if (err3) {
                    console.log(err3);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }
                return res.status(StatusCodes.OK).json({
                    liked: true,
                    message: '좋아요가 추가되었습니다.'
                });
            });
        }
    });
};

module.exports = { toggleLike };

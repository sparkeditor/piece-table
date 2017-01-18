/**
 * A piece table is an efficient data structure to track changes to a text
 * See https://www.cs.unm.edu/~crowley/papers/sds/node15.html for details
 *
 * @param {string} fileText - the initial text of the piece table
 * @constructor
 * @module PieceTable
 */
const PieceTable = function(fileText) {
    /**
     * The file buffer represents the original file text
     * @type {string}
     */
    const file = fileText || "";

    /**
     * The add buffer represents text that has been added to the original file
     * @type {string}
     */
    let add = "";

    /**
     * A Piece describes a window into the file or the add buffer
     * @typedef {Object} Piece
     * @property {boolean} addBuffer - true if the Piece points to the add buffer, false if it points to the file buffer
     * @property {number} offset - the index in the buffer where the Piece starts
     * @property {number} length - the length of the Piece
     */

    /**
     * The piece table describes the sequence as a series of Pieces
     * @type {Piece[]}
     */
    const pieceTable = [{
        addBuffer: false,
        offset: 0,
        length: file.length
    }];

    /**
     * An error thrown when an attempt is made to access the sequence at an invalid index
     * @private
     * @type {Error}
     */
    const outOfBoundsError = new Error("Index out of bounds");

    /**
     * Returns the index in the piece table of the piece that contains the character at offset, and the offset into that piece's buffer corresponding to the offset
     * @private
     * @param offset - an index into the sequence (not into the piece table)
     * @returns {number[]} A 2-number array where the first number is the piece table index, and the second is the offset into that piece's buffer
     */
    const sequenceOffsetToPieceIndexAndBufferOffset = function(offset) {
        if (offset < 0) {
            throw outOfBoundsError;
        }
        let remainingOffset = offset;
        for (let i = 0; i < pieceTable.length; i++) {
            let piece = pieceTable[i];
            if (remainingOffset <= piece.length) {
                return [i, piece.offset + remainingOffset];
            }
            remainingOffset -= piece.length;
        }
        // If this is reached, the offset is greater than the sequence length
        throw outOfBoundsError;
    };

    /**
     * Inserts a string into the piece table
     * @param {string} str - the string to insert
     * @param {number} offset - the offset at which to insert the string
     */
    this.insert = function(str, offset) {
        if (str.length === 0) {
            return;
        }
        const addBufferOffset = add.length;
        add += str;
        const [pieceIndex, bufferOffset] = sequenceOffsetToPieceIndexAndBufferOffset(offset);
        let originalPiece = pieceTable[pieceIndex];
        // If the piece points to the end of the add buffer, and we are inserting at its end, simply increase its length
        if (originalPiece.addBuffer && bufferOffset === originalPiece.offset + originalPiece.length && originalPiece.offset + originalPiece.length === addBufferOffset) {
            originalPiece.length += str.length;
            return;
        }
        const insertPieces = [
            {
                addBuffer: originalPiece.addBuffer,
                offset: originalPiece.offset,
                length: bufferOffset - originalPiece.offset
            },
            {
                addBuffer: true,
                offset: addBufferOffset,
                length: str.length
            },
            {
                addBuffer: originalPiece.addBuffer,
                offset: bufferOffset,
                length: originalPiece.length - (bufferOffset - originalPiece.offset)
            }].filter(function(piece) {
                return piece.length > 0;
            });
        pieceTable.splice(pieceIndex, 1, ...insertPieces);
    };

    /**
     * Deletes a string from the piece table
     * @param {number} offset - the offset at which to begin deletion
     * @param {number} length - the number of characters to delete. If negative, deletes backwards
     */
    this.delete = function(offset, length) {
        if (length === 0) {
            return;
        }
        if (length < 0) {
            return this.delete(offset + length, -length);
        }
        if (offset < 0) {
            throw outOfBoundsError;
        }

        // First, find the affected pieces, since a delete can span multiple pieces
        let [initialAffectedPieceIndex, initialBufferOffset] = sequenceOffsetToPieceIndexAndBufferOffset(offset);
        let [finalAffectedPieceIndex, finalBufferOffset] = sequenceOffsetToPieceIndexAndBufferOffset(offset + length);

        // If the delete occurs at the end or the beginning of a single piece, simply adjust the window
        if (initialAffectedPieceIndex === finalAffectedPieceIndex) {
            let piece = pieceTable[initialAffectedPieceIndex];
            // Is the delete at the beginning of the piece?
            if (initialBufferOffset === piece.offset) {
                piece.offset += length;
                piece.length -= length;
                return;
            }
            // Or at the end of the piece?
            else if (finalBufferOffset === piece.offset + piece.length) {
                piece.length -= length;
                return;
            }
        }

        const deletePieces = [
            {
                addBuffer: pieceTable[initialAffectedPieceIndex].addBuffer,
                offset: pieceTable[initialAffectedPieceIndex].offset,
                length: initialBufferOffset - pieceTable[initialAffectedPieceIndex].offset
            },
            {
                addBuffer: pieceTable[finalAffectedPieceIndex].addBuffer,
                offset: finalBufferOffset,
                length: pieceTable[finalAffectedPieceIndex].length - (finalBufferOffset - pieceTable[finalAffectedPieceIndex].offset)
            }].filter(function(piece) {
                return piece.length > 0;
            });

        pieceTable.splice(initialAffectedPieceIndex, finalAffectedPieceIndex - initialAffectedPieceIndex + 1, ...deletePieces);
    };

    /**
     * Gets the sequence as a string
     * @returns {string} The sequence
     */
    this.getSequence = function() {
        let str = "";
        pieceTable.forEach(function(piece) {
            if (piece.addBuffer) {
                str += add.substr(piece.offset, piece.length);
            }
            else {
                str += file.substr(piece.offset, piece.length);
            }
        });
        return str;
    };

    /**
     * Gets a string of a particular length from the piece table at a particular offset
     * @param {number} offset - the offset from which to get the string
     * @param {number} length - the number of characters to return from the offset. If negative, looks backwards
     */
    this.stringAt = function(offset, length) {
        if (length < 0) {
            return this.stringAt(offset + length, -length);
        }
        let str = "";
        const [initialPieceIndex, initialBufferOffset] = sequenceOffsetToPieceIndexAndBufferOffset(offset);
        const [finalPieceIndex, finalBufferOffset] = sequenceOffsetToPieceIndexAndBufferOffset(offset + length);
        let piece = pieceTable[initialPieceIndex];
        let buf = piece.addBuffer ? add : file;
        let remainingPieceLength = initialBufferOffset - piece.offset;
        if (length < piece.length - (remainingPieceLength)) {
            str = buf.substr(initialBufferOffset, length);
        }
        else {
            str += buf.substr(initialBufferOffset, remainingPieceLength);
            // Iterate through remaining pieces
            for (let i = initialPieceIndex; i <= finalPieceIndex; i++) {
                piece = pieceTable[i];
                buf = piece.addBuffer ? add : file;
                // If this is the final piece, only add the remaining length to the string
                if (i === finalPieceIndex) {
                    str += buf.substr(piece.offset, finalBufferOffset - piece.offset);
                }
                // Otherwise, add the whole piece to the string
                else {
                    str += buf.substr(piece.offset, piece.length);
                }
            }
        }
        return str === "" ? undefined : str;
    };
};

module.exports = PieceTable;

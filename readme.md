# PieceTable.js
## A JavaScript implementation of the piece table data structure
A piece table is an efficient data structure for tracking edits to a text document.
A detailed explanation can be found [here](https://www.cs.unm.edu/~crowley/papers/sds/node15.html).

## Overview
A piece table consists of two buffers, the `file` buffer and the `add` buffer, and a
table of "pieces", or windows into those buffers (the `piece table`). Each piece consists
of a length, an offset, and a descriptor of which buffer the piece points to. The actual
text of the document is represented by the series of pieces in the `piece table`. 
Initially, the `file` buffer consists of the full text of the document and the `add`
buffer is empty. Insertions involve appending the new text to the `add` buffer and
adding pieces to the `piece table` to reflect the addition. Deletion is performed simply
by removing and editing pieces from the `piece table`. This has the added benefit of
never losing data, allowing easy undo operations. Piece table operations are very
efficient because they only ever append to the buffers, so no mid-array insertions or
deletions are performed.

## Installation
```bash
npm install --save piece-table
```
    
## Usage
```javascript
const PieceTable = require("piece-table");

const document = new PieceTable("This is a document with some text.");

document.insert("This is some more text to insert at offset 33.", 33);

// Delete the previously inserted sentence
document.delete(79, 46);

var sequence = document.getSequence();
// sequence == "This is a document with some text."

var subString = document.stringAt(9, 8);
// subString == "document"
```

## API Documentation
<a name="PieceTable"></a>

## PieceTable
**Kind**: global class  

* [PieceTable](#PieceTable)
    * [new PieceTable(fileText)](#new_PieceTable_new)
    * [.insert(str, offset)](#PieceTable+insert)
    * [.delete(offset, length)](#PieceTable+delete)
    * [.getSequence()](#PieceTable+getSequence) ⇒ <code>string</code>
    * [.stringAt(offset, length)](#PieceTable+stringAt)

<a name="new_PieceTable_new"></a>

### new PieceTable(fileText)
A piece table is an efficient data structure to track changes to a text.
See [https://www.cs.unm.edu/~crowley/papers/sds/node15.html] for details


| Param | Type | Description |
| --- | --- | --- |
| fileText | <code>string</code> | the initial text of the piece table |

<a name="PieceTable+insert"></a>

### pieceTable.insert(str, offset)
Inserts a string into the piece table

**Kind**: instance method of <code>[PieceTable](#PieceTable)</code>  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | the string to insert |
| offset | <code>number</code> | the offset at which to insert the string |

<a name="PieceTable+delete"></a>

### pieceTable.delete(offset, length)
Deletes a string from the piece table

**Kind**: instance method of <code>[PieceTable](#PieceTable)</code>  

| Param | Type | Description |
| --- | --- | --- |
| offset | <code>number</code> | the offset at which to begin deletion |
| length | <code>number</code> | the number of characters to delete. If negative, deletes backwards |

<a name="PieceTable+getSequence"></a>

### pieceTable.getSequence() ⇒ <code>string</code>
Gets the sequence as a string

**Kind**: instance method of <code>[PieceTable](#PieceTable)</code>  
**Returns**: <code>string</code> - The sequence  
<a name="PieceTable+stringAt"></a>

### pieceTable.stringAt(offset, length)
Gets a string of a particular length from the piece table at a particular offset

**Kind**: instance method of <code>[PieceTable](#PieceTable)</code>  

| Param | Type | Description |
| --- | --- | --- |
| offset | <code>number</code> | the offset from which to get the string |
| length | <code>number</code> | the number of characters to return from the offset. If negative, looks backwards |


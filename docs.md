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
See <https://www.cs.unm.edu/~crowley/papers/sds/node15.html> for details


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


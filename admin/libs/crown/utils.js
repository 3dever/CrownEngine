
var CrownUtils =
{

    /*
     * Get array data from grid
     */
    gridToArray: function(grid)
    {
        var gridRecords = grid.getStore().getRange();
        var gridArray = [];

        for (i=0; i< gridRecords.length; i++) {
            gridArray.push(gridRecords[i].data);
        }

        return gridArray;
    }

}
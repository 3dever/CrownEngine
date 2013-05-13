using UnityEngine;
using System.Collections;

public class GameConsole : MonoBehaviour {

	// Get items from server
	void ConsoleGetItems () 
    {
        Crown.print("Get Items");
        StartCoroutine(GetItems());
	}
	
    /*
     * Login to server and get user main data
     */ 
    public IEnumerator GetItems(CrownCallbackJSON callback = null)
    {
        JSON parameters = new JSON();
        parameters.AddField("var1", "teeeeeest55555");
        yield return StartCoroutine(Crown.Request("getPlayerItems", parameters, callback, OnGetItems));

    }
    // Callback
    static void OnGetItems(JSON result)
    {
        try
        {
            Crown.print(result.str);
        }
        catch { }
    }

}

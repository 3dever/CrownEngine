using UnityEngine;
using System.Collections;

public delegate void CrownCallback(Object result);
public delegate void CrownCallbackJSON(JSON result);
public delegate void CrownCallbackVoid();

public class Crown : MonoBehaviour {

    // Server URL
    public string serverURL = "";

    // Request data
    public string userId = "";
    public string userKey = "";
    public string userSpot = "";

    // Console log
    static string log = "";

    // Object instance, used for singletone
    public static Crown instance;

    // Constructor
    public void Awake()
    {
        instance = this;
    }

    /*
     * Network request (send data and get result)
     */
	public static IEnumerator Request (string function, JSON parameters = null, CrownCallbackJSON callback = null, CrownCallbackJSON internalCallback = null) 
	{
		string url = instance.serverURL;

		Crown.Log("Server request " + function);
		
		// Create www post
		WWWForm form = new WWWForm();
		
		// Add platform, function and parameters
		form.AddField("function", function);
        form.AddField("parameters", parameters.print());		

		// Add user data
		form.AddField("userId", instance.userId);
        form.AddField("userKey", instance.userKey);
        form.AddField("userSpot", instance.userSpot);
		
		// Download
		WWW www = new WWW(url, form);
    	yield return www;
		
		// Get request
		if (www.error == null)
		{
            // Try to get JSON DATA
            JSON result = null;
            try
            {
                result = new JSON(www.text);
                Crown.Log("Request result: " + result.print());
            }
            catch
            {
                Crown.Error("Server wrong data: " + www.text);
            }

            // Check for server errors
            if (result["error"] != null)
            {
                Crown.Error("Server error: " + result["error"], true);
            }
            // Get json array
            else if (result["data"] != null)
            {
                if (callback != null) callback(result["data"]);
                if (internalCallback != null) internalCallback(result["data"]);
            }
            else
            {
                Crown.Error("Server return's null result", true);
            }

		}
        else Crown.Error("Request error " + url + ", www error: " + www.error, true);
	}


    /**
      * Print message to the log
      * @param msg - message text
      * @param hidetime - if true - time will not printed to log
      */
    public static void Log(string msg, bool hidetime = false)
    {
        if (!hidetime)
        {
            string _time = Time.time.ToString();
            if (_time.Length > 6) _time = _time.Substring(0, 6);
            msg = _time + " " + msg;
        }
        if (log != "") log += "\n";
        log += msg;
    }

    /**
     * Return log history
     */
    public static string GetLog()
    {
        return log;
    }

    /**
      * Report about error
      * @param msg - error text
      * @param fatal - if true - application will stoped with fatal error dialog
      */
    public static void Error(string msg, bool fatal = false)
    {
        msg = "Error: " + msg;
        Log(msg);
        Debug.Log(msg);
    }

    /**
      * Execute command (broadcast to CrownFramework)
      * @param msg - executing command with format "FunctionName param1,param2,..."
      */
    public static void Exec(string msg)
    {
        Log("> " + msg);

        // Get name and arguments
        string[] msgParts = msg.Split(' ');
        string cmdName = "Console" + msgParts[0];
        string[] cmdArgsList = null;

        if (msgParts.Length > 1)
        {
            cmdArgsList = msgParts[1].Split(',');
        }

        // Send message to all modules
        BroadcastToAll(cmdName, cmdArgsList);

    }

    // Broadcast message to all gameobjects
    public static void BroadcastToAll(string functionName, string[] ArgsList)
    {
        GameObject[] gameObjects = (GameObject[])GameObject.FindObjectsOfType(typeof(GameObject));
        foreach (GameObject gameObject in gameObjects)
        {
            if (gameObject && gameObject.transform.parent == null)
            {
                gameObject.gameObject.BroadcastMessage(functionName, ArgsList, SendMessageOptions.DontRequireReceiver);
            }
        }
    }


}

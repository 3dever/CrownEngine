using UnityEngine;
using System.Collections;

public class CrownUser : MonoBehaviour {

    static CrownUser instance;

    // Constructor
    public void Awake()
    {
        instance = this;
    }

    /*
     * Login to server and get user main data
     */ 
    public static IEnumerator LoginByName(string name, string password, CrownCallbackJSON callback = null)
    {
        JSON parameters = new JSON();
        parameters.AddField("name", name);
        parameters.AddField("password", password);
        yield return instance.StartCoroutine(Crown.Request("loginByName", parameters, callback, OnLoginByName));

    }
    // Callback
    static void OnLoginByName(JSON result)
    {
        try
        {
            Crown.instance.userId = result.GetField("userId").str;
            Crown.instance.userKey = result.GetField("userKey").str;
            Crown.instance.userSpot = result.GetField("spot").str;
        }
        catch
        {
            Crown.Error("Login error, data not found");
        }
    }

    public static IEnumerator RegisterByName(string name, string password, CrownCallbackJSON callback = null)
    {
        JSON parameters = new JSON();
        parameters.AddField("name", name);
        parameters.AddField("password", password);
        yield return instance.StartCoroutine(Crown.Request("registerByName", parameters, callback, OnLoginByName));

    }

}

public class CrownUserData 
{
    // Profile
    public string spot = "";
    public string id = "";
    public int level = 0;
    public string location = "0";

    // Data
    public int experience = 0;
    public int Crownld = 0;
    public int crystals = 0;
    public int energy = 0;
    public int maxEnergy = 0;

    public JSON entities;
}
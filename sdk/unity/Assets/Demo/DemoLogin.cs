using UnityEngine;
using System.Collections;

public class DemoLogin : MonoBehaviour {

    string userName = "demo";
    string userPassword = "demo";

    Rect windowRect = new Rect(0, 0, 250, 100);

    void Start()
    {
        // Set window to center
        windowRect.x = Screen.width / 2 - windowRect.width / 2;
        windowRect.y = Screen.height / 2 - windowRect.height / 2;
    }

    void OnGUI()
    {
        windowRect = GUILayout.Window(10, windowRect, LoginWindow, "Authorization");
    }

    // Display login window
    void LoginWindow(int id)
    {
        GUI.BringWindowToFront(id);

        GUILayout.Space(10);

        // Name field
        GUILayout.BeginHorizontal();
        GUILayout.Label("Name: ", GUILayout.Width(80));
        userName = GUILayout.TextField(userName);
        GUILayout.EndHorizontal();

        GUILayout.Space(10);

        // Password field
        GUILayout.BeginHorizontal();
        GUILayout.Label("Password: ", GUILayout.Width(80));
        userPassword = GUILayout.PasswordField(userPassword, '*');
        GUILayout.EndHorizontal();

        GUILayout.Space(10);

        // Login button
        if (GUILayout.Button("Login", GUILayout.Height(30)))
        {
            StartCoroutine(CrownUser.LoginByName(userName, userPassword, OnLogin));
        }

        // Register
        if (GUILayout.Button("Register", GUILayout.Height(30)))
        {
            StartCoroutine(CrownUser.RegisterByName(userName, userPassword, OnLogin));
        }

        GUI.DragWindow();
    }

    /******************************************************
     * EVENTS
     */

    // User is logined
    void OnLogin(JSON result)
    {
        if(!result.HasField("fail")) {
           // enabled = false;
        }
    }


}

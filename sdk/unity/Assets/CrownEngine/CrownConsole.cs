using UnityEngine;
using System.Collections;

/*
 * CrownSDK Console GUI
 */

public class CrownConsole : MonoBehaviour {
	
	public bool display;

	// Console control
	public KeyCode firstKey = KeyCode.LeftControl;
	public KeyCode secondKey = KeyCode.BackQuote;	
	
	// Window parameters
	private Rect wnd = new Rect (5, 5, 600, 400);
	private Vector2 wndTextScroll;
	private string wndTextField = "";
	
	// Last text control
	private ArrayList lastText = new ArrayList();
	private int lastTextId = 0;
	
	// Show/hide console
	public void Display(bool show) 
	{
		display = show;
	}

	void Update () 
	{
		// Display on hotkeys
		if (Input.GetKey (firstKey)) {
			// Display console
			if (Input.GetKeyDown (secondKey)) {
				display = !display;
			}	
		}

	}
	
	void OnGUI () 
	{
		if(!display) return;

		// Display window
		wnd = GUILayout.Window (-1, wnd, WndDisplay, "CrownEngine Console");	
		
		// Keyboard control
		if (Event.current.type == EventType.KeyUp) {

			// On TextField focus
			if( GUI.GetNameOfFocusedControl () == "TextField") 
			{
				// Execute on Enter
		 		if (Event.current.keyCode == KeyCode.Return && wndTextField != "") {
					Crown.Exec (wndTextField);
					lastText.Add(wndTextField);
					lastTextId = lastText.Count;
					wndTextField = "";
				}
				// List input story on up and down arrows
				if(lastText.Count > 0) {
					// Previues text on up arrow
					if(Event.current.keyCode == KeyCode.UpArrow) {
						if(lastTextId > 0) lastTextId--;
						wndTextField = lastText[lastTextId] as string;	
					}
					// Next text on down arrow
					else if(Event.current.keyCode == KeyCode.DownArrow) {
						if(lastTextId < lastText.Count-1) {
							lastTextId++;
							wndTextField = lastText[lastTextId] as string;
						}
						else wndTextField = "";
					}			
				}
			}

			// Hide console on Escape button
			if (Event.current.keyCode == KeyCode.Escape) {
				display = false;
			}

		}

	}

	// Update is called once per frame
	void WndDisplay (int wndId) 
	{	
		// Display log	
		wndTextScroll  = GUILayout.BeginScrollView (wndTextScroll);	
			GUI.SetNextControlName("TextArea");
			GUILayout.TextArea (Crown.GetLog(), GUILayout.ExpandHeight(true));
			// Auto scroll if text area is not focused
			if (GUI.GetNameOfFocusedControl () != "TextArea") {
				GUI.ScrollTo (new Rect(0, 50000, 0, 0));	
			}
		GUILayout.EndScrollView ();			

		// Display input box
		GUI.SetNextControlName("TextField");
		wndTextField = GUILayout.TextField (wndTextField, 5000);	
		
		GUI.DragWindow();
	}

}

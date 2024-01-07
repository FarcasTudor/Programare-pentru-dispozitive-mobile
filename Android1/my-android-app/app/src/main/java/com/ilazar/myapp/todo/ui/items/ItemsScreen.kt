package com.ilazar.myapp.todo.ui.items

import android.app.Application
import android.util.Log
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.width
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AccountBox
import androidx.compose.material.icons.rounded.Add
import androidx.compose.material.icons.rounded.AddCircle
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.ilazar.myapp.todo.ui.MyNetworkStatus
import com.ilazar.myapp.todo.ui.NetworkStatusViewModel

@Composable
fun ItemsScreen(onItemClick: (id: String?) -> Unit, onAddItem: () -> Unit, onLogout: () -> Unit) {
    val myNetworkStatusViewModel = viewModel<NetworkStatusViewModel>(
        factory = NetworkStatusViewModel.Factory(LocalContext.current.applicationContext as Application)
    )
    Log.d("ItemsScreen", "recompose")
    val itemsViewModel = viewModel<ItemsViewModel>(factory = ItemsViewModel.Factory)
    val itemsUiState = itemsViewModel.uiState
    Scaffold(
        topBar = {
            Column {
                TopAppBar(
                    title = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(text = "Items", color = Color.White)
                            Spacer(modifier = Modifier.width(8.dp))
                            MyNetworkStatus(myNetworkStatusViewModel)
                        }
                    },
                    backgroundColor = Color(0xFF3800b4),
                    actions = {
                        Button(
                            onClick = onLogout,
                            colors = ButtonDefaults.buttonColors(backgroundColor = Color(0xFF2D9596))
                        ) { Text("Logout", color = Color.White) }
                    }

                )
            }
        },
        snackbarHost = {
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    Log.d("ItemsScreen", "add")
                    onAddItem()
                },
                backgroundColor = Color(0xFF2D9596)
            ) { Icon(Icons.Rounded.Add, "Add", tint = Color.White, ) }
        }
    ) {
        when (itemsUiState) {
            is ItemsUiState.Success ->
                ItemList(itemList = itemsUiState.items, onItemClick = onItemClick)
            is ItemsUiState.Loading -> CircularProgressIndicator()
            is ItemsUiState.Error -> Text(text = "Failed to load items - $it, ${itemsUiState.exception?.message}")
        }
    }
}

@Preview
@Composable
fun PreviewItemsScreen() {
    ItemsScreen(onItemClick = {}, onAddItem = {}, onLogout = {})
}
